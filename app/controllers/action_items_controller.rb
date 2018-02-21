class ActionItemsController < ApplicationController

  def new
    @action_item = ActionItem.new
    @instruments = current_project.instruments.sort
    @equipment = current_project.equipment.sort
    @handvalves = current_project.handvalves.sort
  end

  def create
    @action_item = current_project.action_items.build(action_item_params)
    if @action_item.save
      flash[:success] = 'Action Item Created'
      redirect_to project_action_items_path
    else
      flash[:warning] = 'Action Item could not be created'
      render :new
    end
  end

  def show
    @action_item = ActionItem.find(params[:id])
  end

  def edit
    @action_item = ActionItem.find(params[:id])
    @instruments = current_project.instruments
    @equipment = current_project.equipment
    @handvalves = current_project.handvalves
  end

  def update
    @action_item = ActionItem.find(params[:id])
    if @action_item.update(action_item_params)
      respond_to do |format|
        format.html {
          flash[:success] = "Action Item Updated"
          redirect_to project_action_items_path
        }
        format.js
      end
    else
      flash[:danger] = "Action Item could not be updated"
      render :edit
    end

  end

  def destroy
    @action_item = ActionItem.find(params[:id])
    @action_item.delete
    flash[:success] = "Action Item delete"
    redirect_to project_action_items_path
  end


  private

  def action_item_params
    params.require(:action_item).permit(:priority,
                                        :area,
                                        :title,
                                        :target_date,
                                        :completion_date,
                                        :sent_by,
                                        :description,
                                        :status,
                                        instrument_ids: [],
                                        equipment_ids: [],
                                        handvalve_ids: [])
  end
end
