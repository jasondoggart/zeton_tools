class ProjectSessionsController < ApplicationController

  def create
    @project = Project.find(params[:project])
    session[:project_id] = @project.id
    redirect_to project_path(@project)
  end
end
