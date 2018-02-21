class Handvalve < ApplicationRecord
  belongs_to :project
  has_and_belongs_to_many :information_requests
  has_and_belongs_to_many :action_items
  validates_presence_of :tag

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
