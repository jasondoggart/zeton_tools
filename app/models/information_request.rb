class InformationRequest < ApplicationRecord
  belongs_to :project
  has_and_belongs_to_many :instruments
  has_and_belongs_to_many :equipment
  has_and_belongs_to_many :handvalves
  has_many :rfi_responses
  validates_presence_of :zeton_clarification

  scope :with_status, -> (status) {
    where(answered: status)
  }

  scope :with_area, -> (area) {
    where(area: area)
  }

  scope :sorted_by, -> (sort_option) {
    direction = (sort_option =~ /desc$/) ? 'desc' : 'asc'
    case sort_option.to_s
    when /^target_date_/
      order("information_requests.target_date #{direction}")
    when /^answered_/
      order("information_requests.answered #{direction}")
    when /^date_created_/
      order("information_requests.created_at #{direction}")
    end
  }

  def rfi_number
    'ZET-RFI-' + id.to_s
  end
end
