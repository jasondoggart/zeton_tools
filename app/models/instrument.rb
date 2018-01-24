class Instrument < ApplicationRecord
  validates_presence_of :type_code, :loop
  has_and_belongs_to_many :information_requests
  belongs_to :project
end
