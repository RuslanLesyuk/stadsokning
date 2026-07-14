import ReviewsSection from "@/components/reviews/review-section"
import type { Locale } from "@/lib/i18n"

type JobReviewsSectionProps = {
  jobId: string
  revieweeId: string
  locale: Locale
  allowReview: boolean
}

const labels = {
  uk: {
    title: "Відгуки",
    summaryReviews: "відгуків",
    noReviews: "Ще немає відгуків.",
    anonymousUser: "Користувач",
    leaveReview: "Залишити відгук",
    leaveReviewSubtitle:
      "Оцініть іншого учасника після завершення замовлення.",
    rating: "Оцінка",
    comment: "Коментар",
    commentPlaceholder: "Опишіть свій досвід співпраці...",
    submit: "Опублікувати відгук",
    submitting: "Публікуємо...",
    success: "Ваш відгук опубліковано.",
    alreadyReviewed:
      "Ви вже залишили відгук про це замовлення.",
    ownEntity: "Не можна залишити відгук самому собі.",
    loginRequired: "Увійдіть, щоб залишити відгук.",
    loginButton: "Увійти",
    deleteReview: "Видалити відгук",
  },
  ru: {
    title: "Отзывы",
    summaryReviews: "отзывов",
    noReviews: "Отзывов пока нет.",
    anonymousUser: "Пользователь",
    leaveReview: "Оставить отзыв",
    leaveReviewSubtitle:
      "Оцените другого участника после завершения заказа.",
    rating: "Оценка",
    comment: "Комментарий",
    commentPlaceholder: "Опишите ваш опыт сотрудничества...",
    submit: "Опубликовать отзыв",
    submitting: "Публикуем...",
    success: "Ваш отзыв опубликован.",
    alreadyReviewed:
      "Вы уже оставили отзыв об этом заказе.",
    ownEntity: "Нельзя оставить отзыв самому себе.",
    loginRequired: "Войдите, чтобы оставить отзыв.",
    loginButton: "Войти",
    deleteReview: "Удалить отзыв",
  },
  en: {
    title: "Reviews",
    summaryReviews: "reviews",
    noReviews: "No reviews yet.",
    anonymousUser: "User",
    leaveReview: "Leave a review",
    leaveReviewSubtitle:
      "Rate the other participant after the job has been completed.",
    rating: "Rating",
    comment: "Comment",
    commentPlaceholder: "Describe your experience working together...",
    submit: "Publish review",
    submitting: "Publishing...",
    success: "Your review has been published.",
    alreadyReviewed:
      "You have already reviewed this job.",
    ownEntity: "You cannot leave a review for yourself.",
    loginRequired: "Log in to leave a review.",
    loginButton: "Log in",
    deleteReview: "Delete review",
  },
  sv: {
    title: "Recensioner",
    summaryReviews: "recensioner",
    noReviews: "Inga recensioner ännu.",
    anonymousUser: "Användare",
    leaveReview: "Lämna en recension",
    leaveReviewSubtitle:
      "Betygsätt den andra deltagaren efter att jobbet har slutförts.",
    rating: "Betyg",
    comment: "Kommentar",
    commentPlaceholder: "Beskriv din erfarenhet av samarbetet...",
    submit: "Publicera recension",
    submitting: "Publicerar...",
    success: "Din recension har publicerats.",
    alreadyReviewed:
      "Du har redan recenserat det här jobbet.",
    ownEntity: "Du kan inte recensera dig själv.",
    loginRequired: "Logga in för att lämna en recension.",
    loginButton: "Logga in",
    deleteReview: "Ta bort recension",
  },
  pl: {
    title: "Opinie",
    summaryReviews: "opinii",
    noReviews: "Brak opinii.",
    anonymousUser: "Użytkownik",
    leaveReview: "Dodaj opinię",
    leaveReviewSubtitle:
      "Oceń drugiego uczestnika po zakończeniu zlecenia.",
    rating: "Ocena",
    comment: "Komentarz",
    commentPlaceholder: "Opisz swoje doświadczenie ze współpracy...",
    submit: "Opublikuj opinię",
    submitting: "Publikowanie...",
    success: "Twoja opinia została opublikowana.",
    alreadyReviewed:
      "To zlecenie zostało już przez Ciebie ocenione.",
    ownEntity: "Nie możesz wystawić opinii samemu sobie.",
    loginRequired: "Zaloguj się, aby dodać opinię.",
    loginButton: "Zaloguj się",
    deleteReview: "Usuń opinię",
  },
} as const

export default function JobReviewsSection({
  jobId,
  revieweeId,
  locale,
  allowReview,
}: JobReviewsSectionProps) {
  return (
    <ReviewsSection
      entityType="job"
      entityId={jobId}
      revieweeId={revieweeId}
      pathname={`/jobs/${jobId}`}
      locale={locale}
      allowReview={allowReview}
      labels={labels[locale]}
    />
  )
}