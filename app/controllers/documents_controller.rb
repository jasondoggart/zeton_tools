class DocumentsController < ApplicationController

  def new
    @document = Document.new
    @project = Project.find(params[:project])
  end

  def create
    @document = Document.new(document_params)
    @project = @document.project
    if @document.save
      flash[:success] = "Document successfully added"
      redirect_to project_documents_path(@project)
    else
      flash[:danger] = "Document could not be added"
      render :new
    end
  end

  private

  def document_params
    params.require(:document).permit(:name,
                                    :phase,
                                    :timing,
                                    :file_location,
                                    :document_type,
                                    :revision_name,
                                    :revision_type,
                                    :revision_frequency,
                                    :project_id,
                                    :prepared_by_role,
                                    :delivered_to_role)
  end
end
