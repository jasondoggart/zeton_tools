class Handvalve < ApplicationRecord
  belongs_to :project
  validates_presence_of :tag
end
