class Instrument < ApplicationRecord
  validates_presence_of :type_code, :loop
  has_and_belongs_to_many :information_requests
  has_and_belongs_to_many :action_items
  belongs_to :project



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
