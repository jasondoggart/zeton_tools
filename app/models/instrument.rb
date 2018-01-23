class Instrument < ApplicationRecord
  validates_presence_of :type_code, :loop
end
