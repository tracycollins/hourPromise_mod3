class UsersController < ApplicationController
  
  def index
    @users = User.all
    render json: @users
  end

  def login
    @user = User.find_by(username: params[:usernameFromFrontEnd])
    if @user
        render json: @user 
    else
        render json: {error: "No user with that username exists"}
    end
  end

  def payments
    @user = User.find_by(username: params[:username])
    if @user
        render json: @user.payments
    else
        render json: {error: "No user with that username exists"}
    end
  end
  
  def commitments
    @user = User.find_by(username: params[:username])
    if @user
        render json: @user.commitments
    else
        render json: {error: "No user with that username exists"}
    end
  end
  
  def causes
    @user = User.find_by(username: params[:username])
    if @user
        render json: @user.causes
    else
        render json: {error: "No user with that username exists"}
    end
  end
  
end
