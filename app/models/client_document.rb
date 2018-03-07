class ClientDocument < ApplicationRecord
  belongs_to :project
  has_many :information_requests
  validates_presence_of :document_name
end
