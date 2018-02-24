class ProjectInstrumentImportsController < ApplicationController
  def new
    @project_instruments_import = ProjectInstrumentImport.new
  end

  def create
    @project_instruments_import = ProjectInstrumentImport.new(params[:project_instrument_import])
    if @project_instruments_import.save
      redirect_to project_instruments_path
      flash[:success] = "Instruments imported for project #{current_project.project_number}"
    else
      render :new
    end
  end
end
