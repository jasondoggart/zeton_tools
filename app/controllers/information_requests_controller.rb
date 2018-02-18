class InformationRequestsController < ApplicationController
  before_action :require_login

  def new
    @information_request = InformationRequest.new
    @instruments = current_project.instruments
    @equipment = current_project.equipment
    @handvalves = current_project.handvalves
  end

  def create
    @information_request = current_project.information_requests.build(information_request_params)
    if @information_request.save
      flash[:success] = "RFI created"
      redirect_to project_rfis_path
    else
      flash[:danger] = "RFI could not be created"
      render :new
    end
  end

  def edit
    @information_request = InformationRequest.find(params[:id])
    @instruments = current_project.instruments
    @equipment = current_project.equipment
    @handvalves = current_project.handvalves
  end

  def update
    @information_request = InformationRequest.find(params[:id])
    if @information_request.update(information_request_params)
      flash[:success] = "RFI successfully updated"
      redirect_to project_rfis_path
    else
      flash[:danger] = "RFI could not be updated"
      render :edit
    end
  end

  def destroy
    @information_request = InformationRequest.find(params[:id])
    @information_request.delete
    flash[:info] = "RFI deleted"
    redirect_to project_rfis_path
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
                                                  :project_id,
                                                  instrument_ids: [],
                                                  equipment_ids: [],
                                                  handvalve_ids: []
                                                 )
    end
end
