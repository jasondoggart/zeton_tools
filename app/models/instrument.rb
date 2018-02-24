class Instrument < ApplicationRecord
  validates_presence_of :type_code, :loop
  has_and_belongs_to_many :information_requests
  has_and_belongs_to_many :action_items
  belongs_to :project

  attr_accessible :type_code,
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
    :checked_by_eng


  scope :sorted_by, -> (sort_option) {
    direction = (sort_option =~ /desc$/) ? 'desc' : 'asc'
    case sort_option.to_s
    when /^type_/
      order("instruments.type_code #{direction}")
    when /^loop_/
      order("instruments.loop #{direction}")
    when /^scope_/
      order("instruments.scope #{direction}")
    when /^tag_/
      order("instruments.type_code #{direction}", "instruments.loop #{direction}")
    end
  }

  scope :with_type_code, -> (type_code) {
    where(type_code: type_code)
  }

  scope :with_loop, -> (loop_selected) {
    where(loop: loop_selected)
  }

  def tag
    type_code + "-" + loop
  end

end
