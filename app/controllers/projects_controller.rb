class ProjectsController < ApplicationController
  before_action :set_project, only: [:show,
                                     :edit,
                                     :update,
                                     :project_instruments,
                                     :project_instruments_metrics,
                                     :project_equipment,
                                     :project_equipment_metrics,
                                     :project_rfis,
                                     :project_documents]

  def show
  end

  def project_instruments
    @instruments = @project.instruments.paginate(:page => params[:page], :per_page => 15)
  end

  def project_instruments_metrics
    @instruments = @project.instruments
  end

  def project_equipment
    @equipment = @project.equipment
  end

  def project_equipment_metrics
    @equipment = @project.equipment
  end

  def project_rfis
    @rfis = @project.information_requests
  end

  def project_documents
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
    @users = User.all
  end

  def update
    @users = User.all
    if @project.update(project_params)
      flash[:success] = "Project updated successfully"
      redirect_to project_path(@project)
    else
      flash[:danger] = "Project could not be updated"
      redirect_to edit_project_path(@project)
    end
  end

  private

  def project_params
    params.require(:project).permit(:project_number, :project_name, :user_id, :client)
  end

  def set_project
    # TODO - Redirect user to select project if nothing set as current_project
    @project = current_project
  end
end
