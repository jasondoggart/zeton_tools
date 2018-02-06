class RfiResponsesController < ApplicationController
  before_action :require_login
  def new
    @rfi = InformationRequest.find(params[:rfi])
    @rfi_response = RfiResponse.new
  end

  def create
    @rfi_response = RfiResponse.new(rfi_response_params)
    @rfi = @rfi_response.information_request
    if @rfi_response.save
      flash[:success] = "RFI response added"
      redirect_to information_request_path(@rfi)
    else
      flash[:danger] = "Could not create RFI response"
      redirect_to new_rfi_response_path(:rfi => @rfi)
    end
  end

  def edit
    @rfi_response = RfiResponse.find(params[:id])
    @rfi = @rfi_response.information_request
  end

  def update
    @rfi_response = RfiResponse.find(params[:id])
    if @rfi_response.update(rfi_response_params)
      flash[:success] = "RFI Response Updated"
      redirect_to information_request_path(@rfi_response.information_request)
    else
      flash[:danger] = "RFI could not be updated"
      redirect_to edit_rfi_response_path(@rfi_response)
    end
  end

  def destroy
    @rfi_response = RfiResponse.find(params[:id])
    @rfi = @rfi_response.information_request
    @rfi_response.delete
    flash[:info] = "RFI response deleted"
    redirect_to information_request_path(@rfi)
  end

  private

    def rfi_response_params
      params.require(:rfi_response).permit(:response,
                                           :organization,
                                           :responder,
                                           :information_request_id)
    end
end
