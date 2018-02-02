class ProjectsController < ApplicationController

  def show
    @project = Project.find(params[:id])
  end

  def project_instruments
    @project = Project.find(params[:id])
    @instruments = @project.instruments
  end

  def project_instruments_metrics
    @project = Project.find(params[:id])
    @instruments = @project.instruments
  end

  def project_equipment
    @project = Project.find(params[:id])
    @equipment = @project.equipment
  end

  def project_equipment_metrics
    @project = Project.find(params[:id])
    @equipment = @project.equipment
  end

  def project_rfis
    @project = Project.find(params[:id])
    @rfis = @project.information_requests
  end

  def project_documents
    @project = Project.find(params[:id])
    @documents = @project.documents
  end

  def new
    @project = Project.new
    @users = User.all
  end

  def create
    @project = Project.new(project_params)
    if @project.save
      flash[:success] = "Project created"
      redirect_to root_path
    else
      flash[:danger] = "Project could not be created"
      redirect_to new_project_path
    end
  end

  def edit
    @project = Project.find(params[:id])
    @users = User.all
  end

  def update
    @project = Project.find(params[:id])
    @users = User.all
    if @project.update(project_params)
      flash[:success] = "Project updated successfully"
      redirect_to project_path(@project)
    else
      flash[:danger] = "Project could not be updated"
      redirect_to edit_project_path(@projet)
    end
  end

  private

  def project_params
    params.require(:project).permit(:project_number, :project_name, :user_id)
  end
end
