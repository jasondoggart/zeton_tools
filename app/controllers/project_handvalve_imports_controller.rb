class ProjectHandvalveImportsController < ApplicationController
  def new
    @project_handvalves_import = ProjectHandvalveImport.new
  end

  def create
    @project_handvalves_import = ProjectHandvalveImport.new(params[:project_handvalve_import])
    if @project_handvalves_import.save
      redirect_to project_handvalves_path
      flash[:success] = "Handvalves imported for project #{current_project.project_number}"
    else
      render :new
    end
  end
end
