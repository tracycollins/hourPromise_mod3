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
end
