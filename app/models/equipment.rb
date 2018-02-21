class Equipment < ApplicationRecord
  validates_presence_of :tag, :description, :equipment_type
  has_and_belongs_to_many :information_requests
  has_and_belongs_to_many :action_items
  belongs_to :project

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
end
