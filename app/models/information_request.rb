class InformationRequest < ApplicationRecord
  has_and_belongs_to_many :instruments
  has_and_belongs_to_many :equipment
  validates_presence_of :zeton_clarification
end
