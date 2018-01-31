module ApplicationHelper

  def icon_select(value)
    case value
    when 0
      content_tag(:i, nil, class: 'fa fa-times-circle text-warning fa-2x')
    when 1
      content_tag(:i, nil, class: 'fa fa-check-circle text-success fa-2x')
    when 2
      content_tag(:i, nil, class: 'fa fa-circle text-info fa-2x')
    end
  end

  def metrics_increment(value)
    if value == 0
      1
    elsif value == 1
      2
    else
      0
    end
  end
end
