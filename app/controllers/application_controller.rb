class ApplicationController < ActionController::Base
  include Clearance::Controller
  include ProjectSessionsHelper
  include MetricsHelper
  protect_from_forgery with: :exception
end
