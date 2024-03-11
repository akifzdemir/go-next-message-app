package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Email    string `gorm:"uniqueIndex"`
	UserName string
	Password string
}

type UserResponse struct {
	gorm.Model
	Email    string
	UserName string
}

type UserRequest struct {
	Email    string
	UserName string
	Password string
}

type LoginRequest struct {
	Email    string
	Password string
}
