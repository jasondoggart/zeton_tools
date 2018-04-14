class ActionItem < ApplicationRecord



  validates_presence_of :area, :title, :description
  belongs_to :project
  belongs_to :creator, class_name: "User"
  belongs_to :assigned_to, class_name: "User", optional: true
  has_and_belongs_to_many :instruments
  has_and_belongs_to_many :equipment
  has_and_belongs_to_many :handvalves


  PRIORITIES = ["1", "2", "3"]

  scope :with_status, -> (status) {
    where(status: status)
  }

  scope :with_area, -> (area) {
    where(area: area)
  }

  scope :sorted_by, -> (sort_option) {
    direction = (sort_option =~ /desc$/) ? 'desc' : 'asc'
    case sort_option.to_s
    when /^target_date_/
      order("action_items.target_date #{direction}")
    when /^status_/
      order("action_items.status #{direction}")
    when /^date_created_/
      order("action_items.created_at #{direction}")
    end
  }

  def ai_number
    'ZET-AI-' + id.to_s
  end

  def number_of_associations
    (instruments.count + equipment.count + handvalves.count).to_i
  end

end
