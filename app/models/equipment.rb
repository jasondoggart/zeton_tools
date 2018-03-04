class Equipment < ApplicationRecord
  has_and_belongs_to_many :information_requests
  has_and_belongs_to_many :action_items
  belongs_to :project
  validates_presence_of :tag, :description, :equipment_type
  validates :datasheet_complete,
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
    inclusion: { in: [0,1,2] }

  scope :sorted_by, -> (sort_option) {
    direction = (sort_option =~ /desc$/) ? 'desc' : 'asc'
    case sort_option.to_s
    when /^type_/
      order("equipment.equipment_type #{direction}")
    when /^tag_/
      order("equipment.tag #{direction}")
    end
  }

  scope :with_type, -> (type) {
    where(equipment_type: type)
  }

  def metrics_attributes
    [
      "datasheet_complete",
      "datasheet_released",
      "rfq_sent",
      "po_placed",
      "drawing_for_approval_received",
      "drawing_for_approval_marked_up",
      "drawing_for_approval_sent_to_client",
      "drawing_for_approval_released_for_construction",
      "item_received_at_zeton",
      "item_inspected_and_released",
      "item_installed_by_mech",
      "item_grounded_by_elec",
      "item_inspected_by_eng"
    ]
  end
end
