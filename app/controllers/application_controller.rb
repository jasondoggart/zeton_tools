class ApplicationController < ActionController::Base
  include Clearance::Controller
  include ProjectSessionsHelper
  protect_from_forgery with: :exception
end
