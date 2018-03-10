class ClientDocumentsController < ApplicationController

  def new
    @client_document = ClientDocument.new
  end

  def create
    @client_document = current_project.client_documents.build(
      client_document_params
    )
    if @client_document.save
      flash[:success] = "Document successfully added"
      redirect_to project_client_documents_path
    else
      flash[:danger] = "Could not add document"
      render :new
    end
  end

  def show
    @client_document = ClientDocument.find(params[:id])
  end

  def edit
    @client_document = ClientDocument.find(params[:id])
  end

  def update
    @client_document = ClientDocument.find(params[:id])
    if @client_document.update(client_document_params)
      flash[:success] = "Document details updated"
      redirect_to @client_document
    else
      flash[:danger] = "Could not update"
      render :edit
    end
  end

  def destroy
    @client_document = ClientDocument.find(params[:id])
    @client_document.delete
    flash[:info] = "Document successfully deleted"
    redirect_to project_client_documents_path
  end

  private

  def client_document_params
    params.require(:client_document).permit(:document_name,
                                            :document_number,
                                            :document_revision)
  end

end
