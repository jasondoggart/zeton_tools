class DocumentsController < ApplicationController
  before_action :require_login

  def new
    @document = Document.new
  end

  def create
    @document = current_project.documents.build(document_params)
    if @document.save
      flash[:success] = "Document successfully added"
      redirect_to project_documents_path
    else
      flash[:danger] = "Document could not be added"
      render :new
    end
  end

  def edit
    @document = Document.find(params[:id])
  end

  def update
    @document = Document.find(params[:id])
    if @document.update(document_params)
      respond_to do |format|
        format.html {
          flash[:success] = "Document successfully updated"
          redirect_to project_documents_path
        }
        format.js
      end
    else
      flash[:danger] = "Document could not be updated"
      render :edit
    end
  end

  def destroy
    @document = Document.find(params[:id])
    @document.delete
    flash[:info] = "The document was removed"
    redirect_to project_documents_path

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
                                    :delivered_to_role,
                                    :status)
  end

end
