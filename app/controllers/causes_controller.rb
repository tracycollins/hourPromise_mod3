class CausesController < ApplicationController
  
  def index
    @causes = Cause.all
    render json: @causes
  end

end
