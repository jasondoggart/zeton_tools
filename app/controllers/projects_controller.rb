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
    @rfis = current_project.information_requests.take(3)
    @team_members = current_project.team_members
  end

  def project_metrics
  end

  def project_instruments
    @instruments = current_project.instruments
    @instruments = @instruments.with_type_code(params[
        :with_type_code
      ]) if params[:with_type_code].present?
    @instruments = @instruments.with_loop(params[
      :with_loop
      ]) if params[:with_loop].present?
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

  def project_instruments_excel
    @instruments = current_project.instruments
    respond_to do |format|
      format.xlsx {
        response.headers[
          'Content-Disposition'
        ] = "attachment; filename='#{current_project.project_number} - all_instruments.xlsx'"
      }
    end
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
    @equipment = current_project.equipment
    @equipment = @equipment.with_type(params[:with_type]) if params[:with_type].present?
    if params[:sorted_by].present?
      @equipment = @equipment.sorted_by(params[:sorted_by])
    else
      @equipment = @equipment.order(tag: :asc)
    end
    @sorted_by = params[:sorted_by] if params[:sorted_by].present?
    @types = @equipment.distinct.pluck(:equipment_type).sort
    @equipment = @equipment.paginate(:page => params[:page], :per_page => 10)
  end

  def project_equipment_excel
    @equipment = current_project.equipment
    respond_to do |format|
      format.xlsx {
        response.headers[
          'Content-Disposition'
        ] = "attachment; filename='#{current_project.project_number} - all_equipment.xlsx'"
      }
    end
  end

  def project_equipment_metrics
    @equipment = current_project.equipment
    @equipment = @equipment.with_type(params[:with_type]) if params[:with_type].present?
    if params[:sorted_by].present?
      @equipment = @equipment.sorted_by(params[:sorted_by])
    else
      @equipment = @equipment.order(tag: :asc)
    end
    @sorted_by = params[:sorted_by] if params[:sorted_by].present?
    @types = @equipment.distinct.pluck(:equipment_type).sort
    @equipment = @equipment.paginate(:page => params[:page], :per_page => 10)
  end

  def project_rfis
    @rfis = current_project.information_requests
    @rfis = @rfis.with_status(params[:with_status]) if params[:with_status].present?
    if params[:sorted_by].present?
      @rfis = @rfis.sorted_by(params[:sorted_by])
    else
      @rfis = @rfis.order(answered: :asc)
    end
    @sorted_by = params[:sorted_by] if params[:sorted_by].present?
    @rfis = @rfis.paginate(:page => params[:page], :per_page => 15)
    @open_rfis = current_project.information_requests.where(answered: 0)
  end

  def project_documents
    @documents = current_project.documents
  end

  def project_handvalves
    @handvalves = current_project.handvalves
    @handvalves = @handvalves.with_type(params[:with_type]) if params[:with_type].present?
    @handvalves = @handvalves.with_size(params[:with_size]) if params[:with_size].present?
    if params[:sorted_by].present?
      @handvalves = @handvalves.sorted_by(params[:sorted_by])
    else
      @handvalves = @handvalves.order(tag: :asc)
    end
    @sorted_by = params[:sorted_by] if params[:sorted_by].present?
    @types = @handvalves.distinct.pluck(:valve_type).sort
    @sizes = @handvalves.distinct.pluck(:size).sort
    @handvalves = @handvalves.paginate(:page => params[:page], :per_page => 10)
  end

  def project_handvalves_excel
    @handvalves = current_project.handvalves
    respond_to do |format|
      format.xlsx {
        response.headers[
          'Content-Disposition'
        ] = "attachment; filename='#{current_project.project_number} - all_handvalves.xlsx'"
      }
    end
  end

  def project_handvalves_metrics
    @handvalves = current_project.handvalves
    @handvalves = @handvalves.with_type(params[:with_type]) if params[:with_type].present?
    @handvalves = @handvalves.with_size(params[:with_size]) if params[:with_size].present?
    if params[:sorted_by].present?
      @handvalves = @handvalves.sorted_by(params[:sorted_by])
    else
      @handvalves = @handvalves.order(tag: :asc)
    end
    @sorted_by = params[:sorted_by] if params[:sorted_by].present?
    @types = @handvalves.distinct.pluck(:valve_type).sort
    @sizes = @handvalves.distinct.pluck(:size).sort
    @handvalves = @handvalves.paginate(:page => params[:page], :per_page => 10)
  end

  def project_action_items
    @action_items = current_project.action_items.paginate(:page => params[:page], :per_page => 10)
    @open_action_items = current_project.action_items.where(status: 0)

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
