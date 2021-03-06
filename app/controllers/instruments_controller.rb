class InstrumentsController < ApplicationController
  before_action :require_login
  before_action :must_select_project
  def new
    @instrument = Instrument.new
  end

  def create
    @instrument = current_project.instruments.build(instrument_params)
    if @instrument.save
      flash[:success] = "Instrument created"
      redirect_to project_instruments_path
    else
      flash[:danger] = "Instrument could not be created"
      render :new
    end
  end

  def edit
    @instrument = Instrument.find(params[:id])
  end

  def update
    @instrument = Instrument.find(params[:id])
    if @instrument.update(instrument_params)
      respond_to do |format|
        format.html {
          flash[:success] = "Instrument updated successfully"
          redirect_to project_instruments_path
        }
        format.js
      end
    else
      flash[:danger] = "Instrument could not be updated"
      render :edit
    end
  end

  def show
    @instrument = Instrument.find(params[:id])
  end

  def destroy
    @instrument = Instrument.find(params[:id])
    @instrument.delete
    flash[:info] = "Instrument deleted"
    redirect_to project_instruments_path
  end

  private

    def instrument_params
      params.require(:instrument).permit(
        :type_code,
        :loop,
        :zeton_skid_number,
        :zeton_skid_level,
        :scope,
        :mech_elec,
        :supplier,
        :manufacturer,
        :model,
        :process_connection,
        :material_of_construction,
        :item_type,
        :location,
        :dcs_io_type,
        :range,
        :zeton_po,
        :tracking_number,
        :receiving_info,
        :datasheet_submitted_for_approval,
        :datasheet_approved,
        :rfq_sent,
        :po_placed,
        :item_received,
        :item_inspected_and_released,
        :mounted_by_mechanical,
        :plumbed_by_mechanical,
        :cable_pulled,
        :cable_terminated_at_source,
        :cable_terminated_at_destination,
        :continuity_tested,
        :grounded_by_electrical,
        :checked_by_eng,
        :project_id,
        :datasheet_submitted_for_approval_completed_at,
        :datasheet_approved_completed_at,
        :rfq_sent_completed_at,
        :po_placed_completed_at,
        :item_received_completed_at,
        :item_inspected_and_released_completed_at,
        :mounted_by_mechanical_completed_at,
        :plumbed_by_mechanical_completed_at,
        :cable_pulled_completed_at,
        :cable_terminated_at_source_completed_at,
        :cable_terminated_at_destination_completed_at,
        :continuity_tested_completed_at,
        :grounded_by_electrical_completed_at,
        :checked_by_eng_completed_at
      )
    end
end
