class UsersController < ApplicationController
  
  def index
    @users = User.all
    render json: @users
  end

  def show
    @user = User.find(params[:id])
    if @user
        render json: @user 
    else
        render json: {error: "No user with that id exists"}
    end
  end
  

  def login
    @user = User.find_by(username: params[:usernameFromFrontEnd])
    if @user
        render json: @user 
    else
        render json: {error: "No user with that username exists"}
    end
  end

  def update
    @user = User.find(params[:id])
    if @user
        @user.update(name: params[:user][:name], username: params[:user][:username])
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

  private

  def user_params
    params.require(:user).permit(
      :name,
      :username,
      :address,
      :bio,
      :interests
    )
  end
  
end
