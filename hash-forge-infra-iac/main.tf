provider "aws" {
  region = "us-east-1" # Change to your preferred region
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_key_pair" "deployer" {
  key_name   = "react-app-key"
  public_key = file("~/.ssh/id_rsa.pub")
}

resource "aws_instance" "react_app" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"
  key_name      = aws_key_pair.deployer.key_name

  security_groups = [aws_security_group.react_sg.name]

  user_data = <<-EOF
             #!/bin/bash
              sudo dnf update -y
              sudo dnf install -y nginx nodejs git

              sudo systemctl start nginx
              sudo systemctl enable nginx

              # Clone React App from GitHub
              git clone https://github.com/Isuru-Madusara/Hash-Forge.git /home/ec2-user/react-app

              # Build React App
              cd /home/ec2-user/react-app
              npm install
              npm run build

              # Remove default Nginx welcome page
              sudo rm -rf /usr/share/nginx/html/*

              # Copy React build files to Nginx
              sudo cp -r /home/ec2-user/react-app/dist/* /usr/share/nginx/html/

              # Restart Nginx
              sudo systemctl restart nginx
              EOF

  tags = {
    Name = "ReactAppServer"
  }
}

resource "aws_security_group" "react_sg" {
  name        = "react_app_sg"
  description = "Allow HTTP and SSH access"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}