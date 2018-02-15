class HandvalvesController < ApplicationController
  def new
    @handvalve = Handvalve.new
  end

  def create
    @handvalve = current_project.handvalves.build(handvalve_params)
    if @handvalve.save
      flash[:success] = 'Handvalve created'
      redirect_to project_handvalves_path
    else
      flash[:danger] = 'Handvalve could not be created'
      render :new
    end
  end

  def show
    @handvalve = Handvalve.find(params[:id])
  end

  def edit
    @handvalve = Handvalve.find(params[:id])
  end

  def update
    @handvalve = Handvalve.find(params[:id])
    if @handvalve.update(handvalve_params)
      respond_to do |format|
        format.html {
          flash[:success] = "Handvalve updated"
          redirect_to project_handvalves_path
        }
        format.js
      end
    else
      flash[:danger] = "Handvalve could not be updated"
      render :edit
    end
  end

  def destroy
    @handvalve = Handvalve.find(params[:id])
    @handvalve.delete
    flash[:info] = "Handvalve deleted"
    redirect_to project_handvalves_path

  end

  private 

  def handvalve_params
    params.require(:handvalve).permit(:tag,
                                     :valve_code,
                                     :valve_type,
                                     :size,
                                     :line_number,
                                     :zeton_skid_number,
                                     :zeton_skid_level,
                                     :scope,
                                     :supplier,
                                     :manufacturer,
                                     :model,
                                     :process_connection,
                                     :material_of_construction,
                                     :valve_counting_code,
                                     :valve_location,
                                     :zeton_po)
  end
end
