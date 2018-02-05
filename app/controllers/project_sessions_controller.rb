class ProjectSessionsController < ApplicationController

  def create
    @project = Project.find(params[:project])
    set_current_project(@project)
    redirect_to project_path(@project)
  end
end
