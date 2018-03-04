class Instrument < ApplicationRecord
  has_and_belongs_to_many :information_requests
  has_and_belongs_to_many :action_items
  belongs_to :project

  validates_presence_of :type_code, :loop
  validates :datasheet_submitted_for_approval,
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
    inclusion: {
    in: [0, 1, 2],
    message: "%{value} is not a valid option for metrics"
  }


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

  def metrics_attributes
    ["datasheet_submitted_for_approval",
     "datasheet_approved",
     "rfq_sent",
     "po_placed",
     "item_received",
     "item_inspected_and_released",
     "mounted_by_mechanical",
     "plumbed_by_mechanical",
     "cable_pulled",
     "cable_terminated_at_source",
     "cable_terminated_at_destination",
     "continuity_tested",
     "grounded_by_electrical",
     "checked_by_eng"
    ]
  end

end
