class ProjectExtractImportsController < ApplicationController

  def new
    @project_extract_import = ProjectExtractImport.new
  end

  def create
    @project_extract_import = ProjectExtractImport.new(
      params[:project_extract_import]
    )
    if @project_extract_import.save
      redirect_to root_path
      flash[:success] = "BOM Successfully Imported from Extract"
    else
      render :new
    end
  end
end
