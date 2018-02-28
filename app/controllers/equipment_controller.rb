class EquipmentController < ApplicationController
  before_action :require_login
  before_action :must_select_project

  def new
    @equipment = Equipment.new
  end

  def create
    @equipment = current_project.equipment.build(equipment_params)
    if @equipment.save
      flash[:success] = "Equipment added"
      redirect_to project_equipment_path
    else
      flash[:danger] = "Equipment could not be added"
      render :new
    end
  end

  def edit
    @equipment = Equipment.find(params[:id])
  end

  def update
    @equipment = Equipment.find(params[:id])
    if @equipment.update(equipment_params)
      respond_to do |format|
        format.html {
          flash[:success] = "Equipment updated"
          redirect_to project_equipment_path
        }
        format.js
      end
    else
      flash[:danger] = "Equipment could not be updated"
      render :edit
    end
  end

  def destroy
    @equipment = Equipment.find(params[:id])
    @equipment.delete
    flash[:info] = "Equipment removed"
    redirect_to project_equipment_path
  end

  def show
    @equipment = Equipment.find(params[:id])
  end
  private
    
    def equipment_params
      params.require(:equipment).permit(:tag,
                                        :description,
                                        :equipment_type,
                                        :scope,
                                        :supplier,
                                        :manufacturer,
                                        :model_number,
                                        :zeton_po,
                                        :tracking_number,
                                        :receiving_info,
                                        :datasheet_complete,
                                        :datasheet_released,
                                        :rfq_sent,
                                        :po_placed,
                                        :drawing_for_approval_received,
                                        :drawing_for_approval_marked_up,
                                        :drawing_for_approval_sent_to_client,
                                        :drawing_for_approval_released_for_construction,
                                        :item_received_at_zeton,
                                        :item_inspected_and_released,
                                        :item_installed_by_mech,
                                        :item_grounded_by_elec,
                                        :item_inspected_by_eng,
                                        :project_id)
    end

end
