class ProjectEquipmentImportsController < ApplicationController
  def new
    @project_equipment_import = ProjectEquipmentImport.new
  end

  def create
    @project_equipment_import = ProjectEquipmentImport.new(params[:project_equipment_import])
    if @project_equipment_import.save
      redirect_to project_equipment_path
      flash[:success] = "Equipment imported for project #{current_project.project_number}"
    else
      render :new
    end
  end
end
