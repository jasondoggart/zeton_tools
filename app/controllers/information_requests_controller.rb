class InformationRequestsController < ApplicationController

  def new
    @project = Project.find(params[:project])
    @information_request = @project.information_requests.new
  end

  def create
    @information_request = InformationRequest.new(information_request_params)
    if @information_request.save
      flash[:success] = "RFI created"
      redirect_to project_rfis_path(@information_request.project)
    else
      flash[:danger] = "RFI could not be created"
      redirect_to new_information_request_path(:project => @information_request.project)
    end
  end

  def edit
    @information_request = InformationRequest.find(params[:id])
    @project = @information_request.project
  end

  def update
    @information_request = InformationRequest.find(params[:id])
    @project = @information_request.project
    if @information_request.update(information_request_params)
      flash[:success] = "RFI successfully updated"
      redirect_to project_rfis_path(@project)
    else
      flash[:danger] = "RFI could not be updated"
      redirect_to edit_information_request_path(@information_request)
    end
  end

  def destroy
    @information_request = InformationRequest.find(params[:id])
    @project = @information_request.project
    @information_request.delete
    flash[:info] = "RFI deleted"
    redirect_to project_rfis_path(@project)
  end

  def show
    @information_request = InformationRequest.find(params[:id])
  end

  private

    def information_request_params
      params.require(:information_request).permit(:client_document_number,
                                                  :client_document_title,
                                                  :client_document_revision,
                                                  :client_document_section,
                                                  :zeton_clarification,
                                                  :project_id
                                                 )
    end
end
