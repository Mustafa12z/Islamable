resource "aws_ecs_cluster" "ecs_project" {
  name = var.ecs-cluster-name
}

resource "aws_ecs_cluster_capacity_providers" "fargate" {
  cluster_name       = aws_ecs_cluster.ecs_project.name
  capacity_providers = var.capacity_providers
}

resource "aws_iam_role" "ecs_execution_role" {
  name = "execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "ecs-execution-role"
  }
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_cloudwatch_log_group" "islamable_log" {
  name              = "/ecs/islamable-log"
  retention_in_days = 7
}

resource "aws_iam_policy" "ecs_islamable_log_policy" {
  name = "ecs_islamable_log_policy"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "arn:aws:logs:eu-west-2:*:log-group:/ecs/islamable-log:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_islamable_log_policy_attach" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = aws_iam_policy.ecs_islamable_log_policy.arn
}

resource "aws_ecs_task_definition" "app" {
  family                   = "ecs-task-definition"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = var.capacity_providers
  cpu                      = 1024
  memory                   = 4096

  runtime_platform {
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }

  container_definitions = jsonencode([
    {
      name      = var.container_name
      image     = var.image
      essential = true
      portMappings = [
        {
          containerPort = 5000,
          hostPort      = 5000
        }
      ],
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-group         = "/ecs/islamable-log",
          awslogs-create-group  = "true",
          awslogs-region        = "eu-west-2",
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "main" {
  name            = "islamable-service"
  cluster         = aws_ecs_cluster.ecs_project.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [var.sg_id]
    subnets          = [var.private_subnet_id, var.private_subnetb_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = var.container_name
    container_port   = 5000
  }
}
