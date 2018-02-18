class InformationRequest < ApplicationRecord
  belongs_to :project
  has_and_belongs_to_many :instruments
  has_and_belongs_to_many :equipment
  has_and_belongs_to_many :handvalves
  has_many :rfi_responses
  validates_presence_of :zeton_clarification

  def rfi_number
    'ZET-RFI-' + id.to_s
  end
end
