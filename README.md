# Recruitment Task — Wieloetapowy formularz dodawania produktu

Aplikacja zrealizowana w oparciu o specyfikację techniczną (`Specyfikacja_Zadania.pdf`) oraz projekt graficzny UI w pliku Figma (`Zadanie rekrutacyjne - WorkConnect.fig`).

---

## 🚀 Instrukcja uruchomienia

### 1. Wymagania wstępne
- **Node.js**: wersja `18.18+` lub nowsza (zalecana wersja 20 LTS lub 22)
- **Menedżer pakietów**: `npm` (wchodzi w skład Node.js), ewentualnie `pnpm`, `yarn` lub `bun`

### 2. Klonowanie i wejście do katalogu
```bash
git clone <adres-repozytorium>
cd recruitment-product-app
```

### 3. Instalacja zależności
Zainstaluj wymagane pakiety:
```bash
npm install
```

### 4. Uruchomienie w trybie deweloperskim
Uruchom lokalny serwer developerski:
```bash
npm run dev
```

Po uruchomieniu serwera otwórz przeglądarkę pod adresem:
👉 **[http://localhost:3000](http://localhost:3000)**

> [!NOTE]
> Aplikacja działa "out-of-the-box" i **nie wymaga** dodatkowej konfiguracji zmiennych środowiskowych (`.env`).

### 5. Dostępne skrypty npm
W pliku `package.json` zdefiniowano następujące polecenia:

| Polecenie | Opis |
| :--- | :--- |
| `npm run dev` | Uruchamia serwer deweloperski z Turbopack na porcie 3000 |
| `npm run build` | Buduje zoptymalizowaną wersję produkcyjną aplikacji |
| `npm run start` | Uruchamia zbudowaną wcześniej wersję produkcyjną |
| `npm run lint` | Weryfikuje kod za pomocą ESLint |

---

## 🛠️ Stack technologiczny

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Komponenty UI & Style**: [shadcn/ui](https://ui.shadcn.com/) (Tailwind CSS v4, Base UI, Lucide Icons, font Geist)
- **Obsługa formularza**: [TanStack Form](https://tanstack.com/form) (`@tanstack/react-form`) — modularne zarządzanie stanem i krokami
- **Walidacja danych**: [Zod](https://zod.dev/) — rygorystyczne schematy walidacji dla każdego z 3 kroków
- **Paginacja URL**: [nuqs](https://nuqs.47ng.com/) — dwukierunkowa synchronizacja stanu paginacji z parametrami wyszukiwania URL (`?page=X`)
- **Powiadomienia**: [Sonner](https://sonner.emilkowal.ski/) (Toast notifications)

---

## ✨ Funkcjonalności i architektura

### 1. Wieloetapowy formularz (Dialog)
- **Otwieranie / zamykanie**: otwarcie przyciskiem *„Dodaj produkt”*. Zamknięcie dialogu (przycisk X, klawisz Esc lub kliknięcie w tło) resetuje formularz do kroku 1 i przywraca wartości domyślne.
- **Wskaźnik kroków (Stepper)**:
  - Krok 1: *Informacje (Dane podstawowe)*
  - Krok 2: *Cena (Dane cenowe)*
  - Krok 3: *Dostępność (Stany magazynowe)*
  - Dynamicznie wyświetla numery kroków, etykiety oraz ikony ukończenia (checkmark).
- **Nawigacja**:
  - Przycisk *Dalej* waliduje bieżący krok za pomocą Zod i blokuje przejście w przypadku błędów.
  - Przycisk *Wstecz* umożliwia powrót do poprzednich kroków bez utraty wpisanych danych.
  - Przycisk *Zapisz produkt* w kroku 3 zatwierdza cały formularz, dodaje produkt do katalogu, wyświetla toast i zamyka modal.

### 2. Szczegóły kroków i walidacji
- **Krok 1 (Informacje podstawowe)**:
  - *Nazwa produktu*: pole tekstowe, wymagane, min. 3 znaki.
  - *SKU produktu*: wymagane, wyłącznie litery i cyfry, maks. 24 znaki.
  - *Opis*: textarea, pole opcjonalne.
  - *Producent*: pole wyboru (Apple, Samsung, Sony, Bosch, Xiaomi) z obsługą wyboru.
  - *Kategoria*: pole wyboru (Komputery, Telefony, RTV, AGD, Akcesoria).
  - *Cechy produktu*: interaktywne badge/tagi (wymagane zaznaczenie min. 1 cechy).
- **Krok 2 (Dane cenowe)**:
  - *Cena netto* oraz *Cena brutto*: dwukierunkowe, synchroniczne przeliczanie kwot wg wzoru:
    $$\text{brutto} = \text{netto} \times (1 + \text{VAT} / 100)$$
  - *Stawka VAT*: wybór ze zdefiniowanej listy (23%, 8%, 5%, 0%) — zmiana stawki natychmiast aktualizuje brutto przy zachowaniu netto.
  - *Waluta*: wybór z listy (PLN, EUR, USD, GBP).
- **Krok 3 (Dostępność i magazyn)**:
  - *Czy produkt jest dostępny*: przełącznik typu `Switch`.
  - *Produkt limitowany*: `Checkbox`.
  - *Ilość na magazynie*: pole widoczne i wymagane **tylko** po zaznaczeniu opcji *Produkt limitowany* (nieujemna liczba całkowita $\ge 0$).
  - *Limity koszyka*: Minimalna ilość na koszyk oraz Maksymalna ilość na koszyk (walidacja: $\text{min} \le \text{maks}$, min. 1).

### 3. Tabela produktów i responsywność
- **Desktop**: tabela z kolumnami: Nazwa, SKU, Kategoria, Cena brutto (sformatowana z wybraną walutą), Status dostępności, Magazyn.
- **Mobile**: dedykowany widok kart (`ProductCards`) zgodny z projektem Figma (ramka mobilna `393x946`).
- **Paginacja**: kontrolowana przez `nuqs` (URL query params, np. `/?page=2`), dzięki czemu stan strony jest zachowywany po odświeżeniu i umożliwia bezpośrednie linkowanie.
- **Toast**: po poprawnym zapisaniu formularza wyświetlane jest powiadomienie *„Produkt został dodany”*, a nowo dodany rekord pojawia się na początku listy.

---

## 📁 Struktura katalogów

```text
├── src/
│   ├── app/
│   │   ├── globals.css         # Style globalne Tailwind v4 i zmienne CSS
│   │   ├── layout.tsx          # Główny layout (font Geist, NuqsAdapter, Toaster)
│   │   └── page.tsx            # Główna strona katalogu produktów
│   ├── components/
│   │   ├── product-dialog/     # Komponenty formularza modalnego i kroków
│   │   │   ├── form-stepper.tsx
│   │   │   ├── step-1-basic.tsx
│   │   │   ├── step-2-price.tsx
│   │   │   └── step-3-inventory.tsx
│   │   ├── product-table/      # Komponenty tabeli, kart i paginacji
│   │   │   ├── product-cards.tsx
│   │   │   ├── product-pagination.tsx
│   │   │   └── product-table.tsx
│   │   └── ui/                 # Komponenty bazowe shadcn / base-ui
│   ├── hooks/                  # Hooki stanu produktów i formularza
│   │   ├── use-product-dialog.ts
│   │   └── use-product-form.ts
│   └── lib/                    # Schematy walidacji Zod, typy, mocki danych
│       ├── form-schema.ts
│       ├── mock-data.ts
│       └── utils.ts
├── package.json
└── README.md
```
