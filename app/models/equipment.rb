class Equipment < ApplicationRecord
  validates_presence_of :tag, :description, :equipment_type
  has_and_belongs_to_many :information_requests
  belongs_to :project
end
