class Equipment < ApplicationRecord
  validates_presence_of :tag, :description, :equipment_type
end
