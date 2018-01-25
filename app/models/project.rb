class Project < ApplicationRecord
  validates_presence_of :project_number, :project_name
  has_many :equipment
  has_many :instruments
  has_many :information_requests
  belongs_to :user
end
