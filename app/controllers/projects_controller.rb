class ProjectsController < ApplicationController
  before_action :require_login
  before_action :set_project, only: [:show, :edit, :update]
  before_action :must_select_project, only: [
                                            :project_instruments,
                                            :project_instruments_metrics,
                                            :project_equipment,
                                            :project_equipment_metrics,
                                            :project_rfis,
                                            :project_documents,
                                            :project_metrics_summary
                                             ]

  def show
  end

  def project_metrics
  end

  def project_instruments
    @instruments = current_project.instruments
    @instruments = @instruments.with_type_code(params[:with_type_code]) if params[:with_type_code].present?
    @instruments = @instruments.with_loop(params[:with_loop]) if params[:with_loop].present?
    if params[:sorted_by].present?
      @instruments = @instruments.sorted_by(params[:sorted_by]) if params[:sorted_by].present?
    else
      @instruments = @instruments.order(type_code: :asc, loop: :asc)
    end
    @sorted_by = params[:sorted_by] if params[:sorted_by].present?
    @type_codes = @instruments.distinct.pluck(:type_code)
    @loops = @instruments.distinct.pluck(:loop).sort
    @instruments = @instruments.paginate(:page => params[:page], :per_page => 10)
  end

  def project_instruments_metrics
    @instruments = current_project.instruments
    @instruments = @instruments.with_type_code(params[:with_type_code]) if params[:with_type_code].present?
    @instruments = @instruments.with_loop(params[:with_loop]) if params[:with_loop].present?
    if params[:sorted_by].present?
      @instruments = @instruments.sorted_by(params[:sorted_by]) if params[:sorted_by].present?
    else
      @instruments = @instruments.order(type_code: :asc, loop: :asc)
    end
    @sorted_by = params[:sorted_by] if params[:sorted_by].present?
    @type_codes = @instruments.distinct.pluck(:type_code)
    @loops = @instruments.distinct.pluck(:loop).sort
    @instruments = @instruments.paginate(:page => params[:page], :per_page => 10)
  end

  def project_equipment
    @equipment = current_project.equipment.paginate(:page => params[:page], :per_page => 15)
  end

  def project_equipment_metrics
    @equipment = current_project.equipment.paginate(:page => params[:page], :per_page => 15)
  end

  def project_rfis
    @rfis = current_project.information_requests.paginate(:page => params[:page], :per_page => 15)
  end

  def project_documents
    @documents = current_project.documents
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
    @project = current_project
  end

  def update
    @project = current_project
    @users = User.all
    if current_project.update(project_params)
      flash[:success] = "Project updated successfully"
      redirect_to project_path(current_project)
    else
      flash[:danger] = "Project could not be updated"
      render :edit
    end
  end

  private

  def project_params
    params.require(:project).permit(:project_number, :project_name, :user_id, :client)
  end

  def set_project
    if !(current_project == Project.find(params[:id]))
      set_current_project(Project.find(params[:id]))
    end
  end
end
