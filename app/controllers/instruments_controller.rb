class InstrumentsController < ApplicationController
  def index
    @instruments = Instrument.all
  end

  def new
    @project = Project.find(params[:project])
    @instrument = @project.instruments.new
  end

  def create
    @instrument = Instrument.new(instrument_params)
    if @instrument.save
      redirect_to project_instruments_path(@instrument.project)
    else
      redirect_to new_instrument_path(:project => @instrument.project)
    end
  end

  def edit
    @instrument = Instrument.find(params[:id])
    @project = @instrument.project
  end

  def update
    @instrument = Instrument.find(params[:id])
    if @instrument.update(instrument_params)
      redirect_to project_instruments_path(@instrument.project)
    else
      redirect_to edit_instrument_path(@instrument)
    end

  end

  private

    def instrument_params
      params.require(:instrument).permit(:type_code,
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
                                         :project_id
                                        )
    end
end
