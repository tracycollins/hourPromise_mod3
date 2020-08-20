class OrgsController < ApplicationController
  def index
    @orgs = Org.all
    render json: @orgs
  end

  def show
    @org = Org.find(params[:id])
    if @orgs
        # @orgs.update_stats
        render json: @orgs 
    else
        render json: {error: "No org with that id exists"}
    end
  end

end
