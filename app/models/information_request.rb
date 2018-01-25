class InformationRequest < ApplicationRecord
  belongs_to :project
  has_and_belongs_to_many :instruments
  has_and_belongs_to_many :equipment
  has_many :rfi_responses
  validates_presence_of :zeton_clarification
end
