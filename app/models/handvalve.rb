class Handvalve < ApplicationRecord
  belongs_to :project
  has_and_belongs_to_many :information_requests
  has_and_belongs_to_many :action_items
  validates_presence_of :tag
  validates :valve_description_complete,
    :valve_description_approved,
    :po_placed,
    :item_received,
    :item_inspected_and_released,
    :item_mounted,
    :item_plumbed,
    :item_checked_by_eng,
    inclusion: { in: [0,1,2] }

  scope :sorted_by, -> (sort_option) {
    direction = (sort_option =~ /desc$/) ? 'desc' : 'asc'
    case sort_option.to_s
    when /^tag_/
      order("handvalves.tag #{direction}")
    end
  }

  scope :with_type, -> (valve_type) {
    where(valve_type: valve_type)
  }

  scope :with_size, -> (valve_size) {
    where(size: valve_size)
  }
end
